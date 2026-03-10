package com.codesnippers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateSnippetRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 100)
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String language;
    private String visibility; // PUBLIC or PRIVATE
    private LocalDateTime expiresAt;
}
