package com.codesnippers.service;

import com.codesnippers.dto.CreateSnippetRequest;
import com.codesnippers.dto.SnippetResponse;
import com.codesnippers.model.Snippet;
import com.codesnippers.model.User;
import com.codesnippers.repository.SnippetRepository;
import com.codesnippers.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SnippetService {

    private final SnippetRepository snippetRepository;
    private final UserRepository userRepository;

    public SnippetResponse createSnippet(CreateSnippetRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Snippet snippet = Snippet.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .language(request.getLanguage())
                .visibility(Snippet.Visibility.valueOf(request.getVisibility()))
                .shortUrl(generateShortUrl())
                .expiresAt(request.getExpiresAt()) // User provides optional expiry
                .permanent(false)
                .user(user)
                .build();

        snippet = snippetRepository.save(snippet);
        return toResponse(snippet);
    }

    @Transactional(readOnly = true)
    public Page<SnippetResponse> getPublicSnippets(String language, String search, String sort, int page, int size) {
        Sort sorting = "popular".equalsIgnoreCase(sort)
                ? Sort.by(Sort.Direction.DESC, "viewCount")
                : Sort.by(Sort.Direction.DESC, "createdAt");

        Pageable pageable = PageRequest.of(page, size, sorting);

        // Use the simple repository query method instead of Specification
        // This avoids all Hibernate type-mapping issues with PostgreSQL columns
        Page<Snippet> snippets = snippetRepository.findByVisibility(
            Snippet.Visibility.PUBLIC, pageable
        );

        return snippets.map(this::toResponse);
    }


    @Transactional
    public SnippetResponse getByShortUrl(String shortUrl) {
        Snippet snippet = snippetRepository.findByShortUrl(shortUrl)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));

        // Check if expired
        if (snippet.getExpiresAt() != null && snippet.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("410:This snippet has expired");
        }

        // Increment view count
        snippet.setViewCount(snippet.getViewCount() + 1);
        snippetRepository.save(snippet);

        return toResponse(snippet);
    }

    @Transactional(readOnly = true)
    public List<SnippetResponse> getMySnippets(Long userId) {
        return snippetRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SnippetResponse updateSnippet(Long id, CreateSnippetRequest request, Long userId) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));

        if (!snippet.getUser().getId().equals(userId)) {
            throw new RuntimeException("403:You can only edit your own snippets");
        }

        if (request.getTitle() != null)
            snippet.setTitle(request.getTitle());
        if (request.getContent() != null)
            snippet.setContent(request.getContent());
        if (request.getLanguage() != null)
            snippet.setLanguage(request.getLanguage());
        if (request.getVisibility() != null) {
            snippet.setVisibility(Snippet.Visibility.valueOf(request.getVisibility()));
        }
        snippet.setExpiresAt(request.getExpiresAt());

        snippet = snippetRepository.save(snippet);
        return toResponse(snippet);
    }

    public void deleteSnippet(Long id, Long userId) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));

        if (!snippet.getUser().getId().equals(userId)) {
            throw new RuntimeException("403:You can only delete your own snippets");
        }

        snippetRepository.delete(snippet);
    }

    // ── Helpers ──────────────────────────────────────────

    private String generateShortUrl() {
        String shortUrl;
        do {
            shortUrl = UUID.randomUUID().toString().replace("-", "").substring(0, 6);
        } while (snippetRepository.existsByShortUrl(shortUrl));
        return shortUrl;
    }

    private SnippetResponse toResponse(Snippet s) {
        return SnippetResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .content(s.getContent())
                .language(s.getLanguage())
                .visibility(s.getVisibility().name())
                .shortUrl(s.getShortUrl())
                .viewCount(s.getViewCount())
                .expiresAt(s.getExpiresAt())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .username(s.getUser().getUsername())
                .build();
    }
}
