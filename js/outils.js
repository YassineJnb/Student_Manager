const tbody = document.getElementById("tbody")
const studentCountEl = document.querySelector(".stat-value")

const renderStudentCount = (count) => {
    if (!studentCountEl) return
    studentCountEl.textContent = String(count)
}

const updateStudentCount = () => {
    if (!tbody) return
    renderStudentCount(tbody.querySelectorAll("tr:not([hidden])").length)
}

const syncStudentsToStorage = (students) => {
    localStorage.setItem("students", JSON.stringify(students))
}

const getStoredStudents = () => {
    try {
        return JSON.parse(localStorage.getItem("students") || "[]")
    }
    catch {
        return []
    }
}

const addStudentToTable = (student) => {
    const tr = document.createElement("tr")
    tr.dataset.cne = student.cne

    const tdCne = document.createElement("td")
    const tdFirstName = document.createElement("td")
    const tdLastName = document.createElement("td")
    const tdDateBirth = document.createElement("td")
    const tdActions = document.createElement("td")
    const span = document.createElement("span")
    const button = document.createElement("button")

    span.textContent = student.cne
    span.classList.add("badge")

    tdFirstName.textContent = student.firstName
    tdLastName.textContent = student.lastName
    tdDateBirth.textContent = student.dateOfBirth

    button.textContent = "Delete"
    button.setAttribute("type", "button")
    button.classList.add("btn", "btn-danger", "btn-sm")
    button.dataset.cne = student.cne

    tdActions.classList.add("td-actions")
    tdCne.append(span)
    tdActions.append(button)
    tr.append(tdCne, tdFirstName, tdLastName, tdDateBirth, tdActions)
    tbody.append(tr)
}

const checkFormValidity = () => {
    if (document.querySelector(".student-form").getElementsByClassName("valid").length === 4) {
        addBtn.removeAttribute("disabled")
    }
    else {
        addBtn.setAttribute("disabled", "true")
    }
}
