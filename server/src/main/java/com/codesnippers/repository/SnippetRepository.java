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

public interface SnippetRepository extends JpaRepository<Snippet, Long>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Snippet> {

    Optional<Snippet> findByShortUrl(String shortUrl);

    Page<Snippet> findByVisibility(Snippet.Visibility visibility, Pageable pageable);

    List<Snippet> findByUserIdOrderByCreatedAtDesc(Long userId);



    List<Snippet> findByExpiresAtBeforeAndExpiresAtIsNotNullAndPermanentFalse(LocalDateTime dateTime);

    boolean existsByShortUrl(String shortUrl);
}
