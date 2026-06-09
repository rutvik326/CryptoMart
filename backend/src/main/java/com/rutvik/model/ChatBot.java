package com.rutvik.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ChatBot {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String chatBotName;

    @Lob
    @Column(length = 100000)
    private String prompt;

    @Lob
    @Column(length = 100000)
    private String response;

    @ManyToOne
    private User user;
}
