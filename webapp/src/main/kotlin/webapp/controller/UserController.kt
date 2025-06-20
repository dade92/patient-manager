package webapp.controller

import domain.user.User
import domain.user.UserId
import domain.user.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService
) {

    @GetMapping("/{userId}")
    fun getUser(@PathVariable userId: String): ResponseEntity<User> {
        val user = userService.retrieveUser(UserId(userId))
        return if (user != null) {
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/search")
    fun searchUsers(@RequestParam name: String): ResponseEntity<SearchUsersResponse> {
        val users = userService.searchUsersByName(name)
        return ResponseEntity.ok(SearchUsersResponse(users))
    }

    @PostMapping
    fun createUser(@RequestBody request: CreateUserRequest): ResponseEntity<User> {
        val user = userService.createUser(
            name = request.name,
            email = request.email,
            birthDate = request.birthDate
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(user)
    }

    data class CreateUserRequest(
        val name: String,
        val email: String,
        val birthDate: LocalDate
    )

    data class SearchUsersResponse(
        val users: List<User>
    )
}
