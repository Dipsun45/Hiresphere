package com.hiresphere.model;

/**
 * Model class for User Messages / Contact Us queries
 */
public class UserMessage {
    private int id;
    private String userId;
    private String fullName;
    private String emailAddress;
    private String phoneNo;
    private String subject;
    private String messageContent;
    private String status;
    private String createdAt;

    public UserMessage() {}

    public UserMessage(int id, String userId, String fullName, String emailAddress, String phoneNo, String subject, String messageContent, String status, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.emailAddress = emailAddress;
        this.phoneNo = phoneNo;
        this.subject = subject;
        this.messageContent = messageContent;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmailAddress() { return emailAddress; }
    public void setEmailAddress(String emailAddress) { this.emailAddress = emailAddress; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessageContent() { return messageContent; }
    public void setMessageContent(String messageContent) { this.messageContent = messageContent; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
