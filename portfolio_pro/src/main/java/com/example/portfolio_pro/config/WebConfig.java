// PATH: src/main/java/com/example/portfolio_pro/config/WebConfig.java
// Serves uploaded images at /uploads/** URL

package com.example.portfolio_pro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from uploads/ folder at /uploads/** URL
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
