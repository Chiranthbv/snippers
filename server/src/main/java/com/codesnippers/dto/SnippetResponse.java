package com.codesnippers.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SnippetResponse {
    private Long id;
    private String title;
    private String content;
    private String language;
    private String visibility;
    private String shortUrl;
    private Integer viewCount;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String username;
}
