package com.codesnippers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CodeSnippersApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeSnippersApplication.class, args);
    }
}
