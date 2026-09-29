package com.hiresphere.model;

/**
 * HireSphere - Model representing candidate profile in MySQL `profile` table
 */
public class CandidateProfile {
    private int id;
    private String userId;
    private String profilePhoto;
    private String fullName;
    private String emailAddress;
    private String phoneNo;
    private String gender;
    private String address;
    private String dob;
    private String tenthPercentage;
    private String tenthYear;
    private String twelfthPercentage;
    private String twelfthYear;
    private String graduationDegree;
    private String graduationMajor;
    private String graduationCgpaPercentage;
    private String graduationYear;
    private String skills;
    private String favoriteTechnologies;
    private String linkedinProfileUrl;
    private String githubProfileUrl;
    private String language;
    private String resumePdfPath;
    private String createdAt;
    private String updatedAt;

    public CandidateProfile() {}

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

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getTenthPercentage() {
        return tenthPercentage;
    }

    public void setTenthPercentage(String tenthPercentage) {
        this.tenthPercentage = tenthPercentage;
    }

    public String getTenthYear() {
        return tenthYear;
    }

    public void setTenthYear(String tenthYear) {
        this.tenthYear = tenthYear;
    }

    public String getTwelfthPercentage() {
        return twelfthPercentage;
    }

    public void setTwelfthPercentage(String twelfthPercentage) {
        this.twelfthPercentage = twelfthPercentage;
    }

    public String getTwelfthYear() {
        return twelfthYear;
    }

    public void setTwelfthYear(String twelfthYear) {
        this.twelfthYear = twelfthYear;
    }

    public String getGraduationDegree() {
        return graduationDegree;
    }

    public void setGraduationDegree(String graduationDegree) {
        this.graduationDegree = graduationDegree;
    }

    public String getGraduationMajor() {
        return graduationMajor;
    }

    public void setGraduationMajor(String graduationMajor) {
        this.graduationMajor = graduationMajor;
    }

    public String getGraduationCgpaPercentage() {
        return graduationCgpaPercentage;
    }

    public void setGraduationCgpaPercentage(String graduationCgpaPercentage) {
        this.graduationCgpaPercentage = graduationCgpaPercentage;
    }

    public String getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(String graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getFavoriteTechnologies() {
        return favoriteTechnologies;
    }

    public void setFavoriteTechnologies(String favoriteTechnologies) {
        this.favoriteTechnologies = favoriteTechnologies;
    }

    public String getLinkedinProfileUrl() {
        return linkedinProfileUrl;
    }

    public void setLinkedinProfileUrl(String linkedinProfileUrl) {
        this.linkedinProfileUrl = linkedinProfileUrl;
    }

    public String getGithubProfileUrl() {
        return githubProfileUrl;
    }

    public void setGithubProfileUrl(String githubProfileUrl) {
        this.githubProfileUrl = githubProfileUrl;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getResumePdfPath() {
        return resumePdfPath;
    }

    public void setResumePdfPath(String resumePdfPath) {
        this.resumePdfPath = resumePdfPath;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
