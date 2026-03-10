package com.codesnippers.service;

import com.codesnippers.repository.SnippetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CleanupService {

    private final SnippetRepository snippetRepository;

    @Scheduled(fixedRate = 3600000) // Every hour
    public void cleanupExpiredSnippets() {
        var expired = snippetRepository.findByExpiresAtBeforeAndExpiresAtIsNotNull(LocalDateTime.now());
        if (!expired.isEmpty()) {
            snippetRepository.deleteAll(expired);
            log.info("Cleaned up {} expired snippets", expired.size());
        }
    }
}
