package com.hiresphere.model;

/**
 * Model class for a user Project entry (with optional Certificate)
 */
public class Project {
    private int id;
    private String userId;

    // Project core fields
    private String projectName;
    private String projectDescription;
    private String techStack;
    private String category;
    private String liveUrl;
    private String githubUrl;
    private String startDate;
    private String endDate;
    private String projectPhoto;     // base64 image
    private String projectZip;       // base64 zip file
    private String projectZipName;   // original filename

    // Certificate fields
    private String certName;
    private String certIssuer;
    private String certDate;
    private String certUrl;
    private String certPhoto;        // base64 image

    private String createdAt;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getProjectDescription() { return projectDescription; }
    public void setProjectDescription(String projectDescription) { this.projectDescription = projectDescription; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLiveUrl() { return liveUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getProjectPhoto() { return projectPhoto; }
    public void setProjectPhoto(String projectPhoto) { this.projectPhoto = projectPhoto; }

    public String getProjectZip() { return projectZip; }
    public void setProjectZip(String projectZip) { this.projectZip = projectZip; }

    public String getProjectZipName() { return projectZipName; }
    public void setProjectZipName(String projectZipName) { this.projectZipName = projectZipName; }

    public String getCertName() { return certName; }
    public void setCertName(String certName) { this.certName = certName; }

    public String getCertIssuer() { return certIssuer; }
    public void setCertIssuer(String certIssuer) { this.certIssuer = certIssuer; }

    public String getCertDate() { return certDate; }
    public void setCertDate(String certDate) { this.certDate = certDate; }

    public String getCertUrl() { return certUrl; }
    public void setCertUrl(String certUrl) { this.certUrl = certUrl; }

    public String getCertPhoto() { return certPhoto; }
    public void setCertPhoto(String certPhoto) { this.certPhoto = certPhoto; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
