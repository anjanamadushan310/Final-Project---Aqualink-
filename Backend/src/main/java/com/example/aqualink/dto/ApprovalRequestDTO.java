package com.example.aqualink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequestDTO {

    @NotBlank(message = "Reason is required for rejection")
    private String reason;

    // Additional fields if needed
    private String adminNotes;

    private String actionType; // APPROVE or REJECT
}
