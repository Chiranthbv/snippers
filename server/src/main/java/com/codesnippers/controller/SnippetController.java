package com.codesnippers.controller;

import com.codesnippers.dto.CreateSnippetRequest;
import com.codesnippers.dto.SnippetResponse;
import com.codesnippers.service.SnippetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/snippets")
@RequiredArgsConstructor
public class SnippetController {

    private final SnippetService snippetService;

    // GET /api/snippets — List public snippets (paginated, filterable)
    @GetMapping
    public ResponseEntity<Page<SnippetResponse>> getPublicSnippets(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(snippetService.getPublicSnippets(language, search, sort, page, size));
    }

    // GET /api/snippets/my — Current user's snippets
    @GetMapping("/my")
    public ResponseEntity<List<SnippetResponse>> getMySnippets(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(snippetService.getMySnippets(userId));
    }

    // GET /api/snippets/{shortUrl} — Get single snippet by short URL
    @GetMapping("/{shortUrl}")
    public ResponseEntity<?> getByShortUrl(@PathVariable String shortUrl) {
        try {
            return ResponseEntity.ok(snippetService.getByShortUrl(shortUrl));
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.startsWith("410:")) {
                return ResponseEntity.status(HttpStatus.GONE)
                        .body(Map.of("message", msg.substring(4)));
            }
            return ResponseEntity.notFound().build();
        }
    }

    // POST /api/snippets — Create new snippet
    @PostMapping
    public ResponseEntity<?> createSnippet(@Valid @RequestBody CreateSnippetRequest request,
            Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            SnippetResponse response = snippetService.createSnippet(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // PUT /api/snippets/{id} — Update snippet (owner only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSnippet(@PathVariable Long id,
            @Valid @RequestBody CreateSnippetRequest request,
            Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            SnippetResponse response = snippetService.updateSnippet(id, request, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.startsWith("403:")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", msg.substring(4)));
            }
            return ResponseEntity.badRequest().body(Map.of("message", msg));
        }
    }

    // DELETE /api/snippets/{id} — Delete snippet (owner only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSnippet(@PathVariable Long id, Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            snippetService.deleteSnippet(id, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.startsWith("403:")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", msg.substring(4)));
            }
            return ResponseEntity.badRequest().body(Map.of("message", msg));
        }
    }
}
