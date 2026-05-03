// PATH: src/main/java/com/example/portfolio_pro/dto/ContactRequest.java

package com.example.portfolio_pro.dto;

public class ContactRequest {
	private String senderName;
	private String senderEmail;
	private String message;

	public ContactRequest() {
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String n) {
		this.senderName = n;
	}

	public String getSenderEmail() {
		return senderEmail;
	}

	public void setSenderEmail(String e) {
		this.senderEmail = e;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String m) {
		this.message = m;
	}
}
