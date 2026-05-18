const resetBtn = document.getElementById("reset-btn")
const addBtn = document.getElementById("add-btn")
const searchInput = document.getElementById("student-search")
addBtn.setAttribute("disabled", "true")
const fields = [cne, firstname, lastname, dob]
let students = getStoredStudents().filter((student) =>
    student &&
    typeof student.cne === "string" &&
    typeof student.firstName === "string" &&
    typeof student.lastName === "string" &&
    typeof student.dateOfBirth === "string"
)

// Removes duplicate students based on CNE.
students = students.filter((student, index, array) =>
    array.findIndex((item) => item.cne === student.cne) === index
)

// Saves the current student list to local storage.
function saveStudents() {
    syncStudentsToStorage(students)
}

saveStudents()

// Trims student form values before validation or storage.
const normalizeStudent = (student) => ({
    cne: student.cne.trim(),
    firstName: student.firstName.trim(),
    lastName: student.lastName.trim(),
    dateOfBirth: student.dateOfBirth,
})

// Checks whether a student object meets the required input rules.
const isStudentValid = (student) => (
    student.cne.length === 8 &&
    student.firstName.length >= 3 &&
    student.lastName.length >= 3 &&
    student.dateOfBirth !== ""
)


// Updates a field's visual state and its validation message.
const setFieldState = (field, isValid, message, messageId) => {
    if (isValid) {
        field.classList.remove("error")
        field.classList.add("valid")
        document.getElementById(messageId).textContent = ""
    }
    else {
        field.classList.add("error")
        field.classList.remove("valid")
        document.getElementById(messageId).textContent = message
    }
}

// Filters the table rows based on the current search query.
const filterStudents = () => {
    const query = searchInput?.value.trim().toLowerCase() || ""

    // Hides rows that do not match the search text.
    tbody.querySelectorAll("tr").forEach((row) => {
        const matches = row.textContent.toLowerCase().includes(query)
        row.hidden = query !== "" && !matches
    })

    renderStudentCount(students.length)
}

// Handles delete clicks from the student table.
tbody.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("button.btn-danger")
    if (!deleteButton) return
    const row = deleteButton.closest("tr")
    const cne = deleteButton.dataset.cne || row?.dataset.cne
    if (!cne) return

    students = students.filter((student) => student.cne !== cne)
    saveStudents()

    if (row) row.remove()
    filterStudents()
})

// Clears all input fields in the student form.
const viderForm = () => {
    cne.value = ""
    firstname.value = ""
    lastname.value = ""
    dob.value = ""
    cne.classList.remove("error", "valid")
    firstname.classList.remove("error", "valid")
    lastname.classList.remove("error", "valid")
    dob.classList.remove("error", "valid")
    document.getElementById("message-cne").textContent = ""
    document.getElementById("message-firstname").textContent = ""
    document.getElementById("message-lastname").textContent = ""
    document.getElementById("message-dob").textContent = ""
}

// Validates the CNE field as the user types.
cne.addEventListener('input', () => {
    setFieldState(cne, cne.value.trim().length === 8, "cne must be 8 characters", "message-cne")
    checkFormValidity()
})

// Validates the last name field as the user types.
lastname.addEventListener('input', () => {
    setFieldState(lastname, lastname.value.trim().length >= 3, "lastname must be at least 3 characters", "message-lastname")
    checkFormValidity()
})

// Validates the first name field as the user types.
firstname.addEventListener('input', () => {
    setFieldState(firstname, firstname.value.trim().length >= 3, "firstname must be at least 3 characters", "message-firstname")
    checkFormValidity()
})

// Validates the date of birth field as the user types.
dob.addEventListener('input', () => {
   setFieldState(dob, dob.value !== "", "date of birth is required", "message-dob")
   checkFormValidity()
})

// Resets the form, clears validation state, and disables submit.
resetBtn.addEventListener('click', () => {
    viderForm()
    fields.forEach((field) => field.classList.remove("error", "valid"))
    document.getElementById("message-cne").textContent = ""
    document.getElementById("message-firstname").textContent = ""
    document.getElementById("message-lastname").textContent = ""
    document.getElementById("message-dob").textContent = ""
    addBtn.setAttribute("disabled", "true")
})

// Validates and stores a new student when the add button is clicked.
addBtn.addEventListener('click', () => {
    const student = normalizeStudent({
        cne: cne.value,
        firstName: firstname.value,
        lastName: lastname.value,
        dateOfBirth: dob.value,
    })

    if (!isStudentValid(student)) {
        checkFormValidity()
        return
    }

    if (students.some((item) => item.cne === student.cne)) {
        document.getElementById("message-cne").textContent = "cne already exists"
        cne.classList.add("error")
        cne.classList.remove("valid")
        addBtn.setAttribute("disabled", "true")
        return
    }

    students.push(student)
    saveStudents()
    addStudentToTable(student)
    viderForm()
    addBtn.setAttribute("disabled", "true")
    filterStudents()
})

// Filters the visible table rows whenever the search input changes.
searchInput?.addEventListener("input", filterStudents)

// Renders all stored students into the table on page load.
students.forEach((student) => {
    addStudentToTable(student)
})

filterStudents()


const escapehtml = (text) => {
    text = text.replace(/&/g, "&amp;")
    text = text.replace(/</g, "&lt;")
    text = text.replace(/>/g, "&gt;")
    text = text.replace(/"/g, "&quot;")
    text = text.replace(/'/g, "&#039;")
    return text
}