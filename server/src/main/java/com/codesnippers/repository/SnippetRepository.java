package com.codesnippers.repository;

import com.codesnippers.model.Snippet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SnippetRepository extends JpaRepository<Snippet, Long> {

    Optional<Snippet> findByShortUrl(String shortUrl);

    List<Snippet> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT s FROM Snippet s WHERE s.visibility = 'PUBLIC' " +
           "AND (CAST(:language AS text) IS NULL OR LOWER(s.language) = LOWER(CAST(:language AS text))) " +
           "AND (CAST(:search AS text) IS NULL OR (LOWER(s.title) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')) " +
           "OR LOWER(s.content) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))))")
    Page<Snippet> findPublicSnippets(
            @Param("language") String language,
            @Param("search") String search,
            Pageable pageable);

    List<Snippet> findByExpiresAtBeforeAndExpiresAtIsNotNullAndPermanentFalse(LocalDateTime dateTime);

    boolean existsByShortUrl(String shortUrl);
}
