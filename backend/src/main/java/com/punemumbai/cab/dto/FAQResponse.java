package com.punemumbai.cab.dto;

import com.punemumbai.cab.entity.FAQ;

public class FAQResponse {

    private Long id;
    private String routeSlug;
    private String question;
    private String answer;

    public FAQResponse() {}

    public FAQResponse(FAQ faq) {
        this.id = faq.getId();
        this.routeSlug = faq.getRouteSlug();
        this.question = faq.getQuestion();
        this.answer = faq.getAnswer();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRouteSlug() { return routeSlug; }
    public void setRouteSlug(String routeSlug) { this.routeSlug = routeSlug; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}
