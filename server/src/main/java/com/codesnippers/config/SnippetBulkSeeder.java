package com.codesnippers.config;

import com.codesnippers.model.Snippet;
import com.codesnippers.model.User;
import com.codesnippers.repository.SnippetRepository;
import com.codesnippers.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class SnippetBulkSeeder implements CommandLineRunner {

    private final SnippetRepository snippetRepository;
    private final UserRepository userRepository;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) {
        long currentSnippetCount = snippetRepository.count();
        if (currentSnippetCount > 40) { // If already has a good amount of snippets, skip to avoid duplicates
            log.info("Database already contains {} snippets, skipping bulk JSON seed.", currentSnippetCount);
            return;
        }

        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            log.warn("No users found to assign snippets to. Skipping bulk seed.");
            return;
        }

        log.info("Starting bulk snippet seed from JSON file...");
        Random random = new Random();

        try {
            Resource resource = resourceLoader.getResource("classpath:snippets-seed.json");
            if (!resource.exists()) {
                log.warn("snippets-seed.json not found in classpath.");
                return;
            }

            try (InputStream inputStream = resource.getInputStream()) {
                List<SeedSnippet> seedSnippets = objectMapper.readValue(inputStream, new TypeReference<>() {
                });

                int added = 0;
                for (SeedSnippet seed : seedSnippets) {
                    User randomUser = users.get(random.nextInt(users.size()));

                    Snippet snippet = Snippet.builder()
                            .title(seed.getTitle())
                            .content(seed.getContent())
                            .language(seed.getLanguage().toLowerCase())
                            .visibility(Snippet.Visibility.PUBLIC)
                            .shortUrl(UUID.randomUUID().toString().substring(0, 8))
                            .user(randomUser)
                            .build();

                    snippetRepository.save(snippet);
                    added++;
                }

                log.info("Successfully seeded {} new snippets from JSON!", added);
            }
        } catch (Exception e) {
            log.error("Failed to execute bulk snippet seed: ", e);
        }
    }

    @Data
    private static class SeedSnippet {
        private String title;
        private String content;
        private String language;
    }
}
