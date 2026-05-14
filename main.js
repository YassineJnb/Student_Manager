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

students = students.filter((student, index, array) =>
    array.findIndex((item) => item.cne === student.cne) === index
)

function saveStudents() {
    syncStudentsToStorage(students)
}

saveStudents()

const normalizeStudent = (student) => ({
    cne: student.cne.trim(),
    firstName: student.firstName.trim(),
    lastName: student.lastName.trim(),
    dateOfBirth: student.dateOfBirth,
})

const isStudentValid = (student) => (
    student.cne.length === 8 &&
    student.firstName.length >= 3 &&
    student.lastName.length >= 3 &&
    student.dateOfBirth !== ""
)

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

const filterStudents = () => {
    const query = searchInput?.value.trim().toLowerCase() || ""

    tbody.querySelectorAll("tr").forEach((row) => {
        const matches = row.textContent.toLowerCase().includes(query)
        row.hidden = query !== "" && !matches
    })

    renderStudentCount(students.length)
}

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
const viderForm = () => {
    cne.value = ""
    firstname.value = ""
    lastname.value = ""
    dob.value = ""
}
cne.addEventListener('input', () => {
    setFieldState(cne, cne.value.trim().length === 8, "cne must be 8 characters", "message-cne")
    checkFormValidity()
})
lastname.addEventListener('input', () => {
    setFieldState(lastname, lastname.value.trim().length >= 3, "lastname must be at least 3 characters", "message-lastname")
    checkFormValidity()
})
firstname.addEventListener('input', () => {
    setFieldState(firstname, firstname.value.trim().length >= 3, "firstname must be at least 3 characters", "message-firstname")
    checkFormValidity()
})
dob.addEventListener('input', () => {
   setFieldState(dob, dob.value !== "", "date of birth is required", "message-dob")
   checkFormValidity()
})
resetBtn.addEventListener('click', () => {
    viderForm()
    fields.forEach((field) => field.classList.remove("error", "valid"))
    document.getElementById("message-cne").textContent = ""
    document.getElementById("message-firstname").textContent = ""
    document.getElementById("message-lastname").textContent = ""
    document.getElementById("message-dob").textContent = ""
    addBtn.setAttribute("disabled", "true")
})
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

searchInput?.addEventListener("input", filterStudents)
students.forEach((student) => {
    addStudentToTable(student)
})

filterStudents()




