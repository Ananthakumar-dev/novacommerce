package com.novacommerce.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import com.novacommerce.auth.entity.User;
import com.novacommerce.auth.enums.Role;
import com.novacommerce.auth.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
class AuthServiceApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@BeforeEach
	void setUp() {
		userRepository.deleteAll();
	}

	@Test
	void contextLoads() {
	}

	@Test
	void registerCustomerSucceedsAndHashesPassword() throws Exception {
		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "customer@example.com",
								  "password": "password123",
								  "fullName": "Customer User",
								  "role": "CUSTOMER"
								}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.token", notNullValue()))
				.andExpect(jsonPath("$.role").value("CUSTOMER"))
				.andExpect(jsonPath("$.email").value("customer@example.com"))
				.andExpect(jsonPath("$.fullName").value("Customer User"));

		User user = userRepository.findByEmail("customer@example.com").orElseThrow();
		assertThat(user.getPassword()).isNotEqualTo("password123");
		assertThat(passwordEncoder.matches("password123", user.getPassword())).isTrue();
	}

	@Test
	void registerMerchantSucceeds() throws Exception {
		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "merchant@example.com",
								  "password": "password123",
								  "fullName": "Merchant User",
								  "role": "MERCHANT"
								}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.role").value("MERCHANT"));
	}

	@Test
	void publicRegisterRejectsAdmin() throws Exception {
		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "admin@example.com",
								  "password": "password123",
								  "fullName": "Admin User",
								  "role": "ADMIN"
								}
								"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Public registration cannot create ADMIN users"));
	}

	@Test
	void duplicateEmailReturnsConflict() throws Exception {
		saveUser("customer@example.com", "Customer User", Role.CUSTOMER);

		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "customer@example.com",
								  "password": "password123",
								  "fullName": "Another User",
								  "role": "CUSTOMER"
								}
								"""))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("A user with this email already exists"));
	}

	@Test
	void loginSucceedsWithValidCredentialsAndFailsWithInvalidCredentials() throws Exception {
		saveUser("customer@example.com", "Customer User", Role.CUSTOMER);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "customer@example.com",
								  "password": "password123"
								}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token", notNullValue()))
				.andExpect(jsonPath("$.role").value("CUSTOMER"));

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "customer@example.com",
								  "password": "wrong-password"
								}
								"""))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid email or password"));
	}

	@Test
	void bootstrapAdminSucceedsOnlyWhenNoAdminExists() throws Exception {
		mockMvc.perform(post("/api/auth/bootstrap/admin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "admin@example.com",
								  "password": "password123",
								  "fullName": "Admin User",
								  "role": "CUSTOMER"
								}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.role").value("ADMIN"));

		mockMvc.perform(post("/api/auth/bootstrap/admin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "second-admin@example.com",
								  "password": "password123",
								  "fullName": "Second Admin",
								  "role": "CUSTOMER"
								}
								"""))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Admin bootstrap is unavailable after an ADMIN exists"));
	}

	@Test
	void adminManagedUserCreationCanCreateAdmin() throws Exception {
		mockMvc.perform(post("/api/auth/admin/users")
						.with(jwt().authorities(() -> "ROLE_ADMIN"))
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "new-admin@example.com",
								  "password": "password123",
								  "fullName": "New Admin",
								  "role": "ADMIN"
								}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.role").value("ADMIN"));
	}

	@Test
	void meRequiresValidToken() throws Exception {
		saveUser("customer@example.com", "Customer User", Role.CUSTOMER);
		String token = loginToken("customer@example.com", "password123");

		mockMvc.perform(get("/api/auth/me"))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(get("/api/auth/me")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("customer@example.com"))
				.andExpect(jsonPath("$.role").value("CUSTOMER"));
	}

	@Test
	void roleProbeEndpointsAllowAndDenyExpectedRoles() throws Exception {
		mockMvc.perform(get("/api/admin/ping")
						.with(jwt().authorities(() -> "ROLE_ADMIN")))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/admin/ping")
						.with(jwt().authorities(() -> "ROLE_MERCHANT")))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/api/merchant/ping")
						.with(jwt().authorities(() -> "ROLE_MERCHANT")))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/merchant/ping")
						.with(jwt().authorities(() -> "ROLE_ADMIN")))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/customer/ping")
						.with(jwt().authorities(() -> "ROLE_CUSTOMER")))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/customer/ping")
						.with(jwt().authorities(() -> "ROLE_MERCHANT")))
				.andExpect(status().isForbidden());
	}

	@Test
	void invalidJwtReturnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/auth/me")
						.header("Authorization", "Bearer not-a-real-token"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid or expired token"));
	}

	private User saveUser(String email, String fullName, Role role) {
		return userRepository.save(User.builder()
				.email(email)
				.password(passwordEncoder.encode("password123"))
				.fullName(fullName)
				.role(role)
				.build());
	}

	private String loginToken(String email, String password) throws Exception {
		String response = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "email": "%s",
								  "password": "%s"
								}
								""".formatted(email, password)))
				.andExpect(status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();

		int tokenStart = response.indexOf("\"token\":\"") + 9;
		int tokenEnd = response.indexOf("\"", tokenStart);
		return response.substring(tokenStart, tokenEnd);
	}

}
