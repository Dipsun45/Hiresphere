package com.hiresphere.model;

import java.io.Serializable;

/**
 * Model representing a candidate's application to a Recruitment Drive.
 */
public class DriveApplication implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String userId;
    private String companyName;
    private String jobTitle;
    private String fullName;
    private String email;
    private String phone;
    private String qualification;
    private String experience;
    private String skills;
    private String resumeUrl;
    private String coverLetter;
    private String applicationStatus;
    private String appliedAt;

    public DriveApplication() {}

    public DriveApplication(String userId, String companyName, String jobTitle, String fullName, 
                            String email, String phone, String qualification, String experience, 
                            String skills, String resumeUrl, String coverLetter) {
        this.userId = userId;
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.qualification = qualification;
        this.experience = experience;
        this.skills = skills;
        this.resumeUrl = resumeUrl;
        this.coverLetter = coverLetter;
        this.applicationStatus = "Submitted";
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public String getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(String appliedAt) {
        this.appliedAt = appliedAt;
    }
}
