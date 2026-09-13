// ============================================
// AWS API
// ============================================

const API_URL =
    "https://7oos9wyhn3.execute-api.us-east-1.amazonaws.com";


// ============================================
// DOM ELEMENTS
// ============================================

const notesContainer =
    document.getElementById("notesContainer");

const emptyState =
    document.getElementById("emptyState");

const noteCount =
    document.getElementById("noteCount");

const modalOverlay =
    document.getElementById("modalOverlay");

const newNoteButton =
    document.getElementById("newNoteButton");

const emptyCreateButton =
    document.getElementById("emptyCreateButton");

const closeModal =
    document.getElementById("closeModal");

const cancelButton =
    document.getElementById("cancelButton");

const noteForm =
    document.getElementById("noteForm");

const titleInput =
    document.getElementById("titleInput");

const contentInput =
    document.getElementById("contentInput");

const searchInput =
    document.getElementById("searchInput");

const toast =
    document.getElementById("toast");


// ============================================
// STORE NOTES
// ============================================

let allNotes = [];


// ============================================
// LOAD ALL NOTES
// ============================================

async function loadNotes() {

    try {

        notesContainer.innerHTML = `
            <div class="loading">
                Loading your notes...
            </div>
        `;

        const response =
            await fetch(`${API_URL}/notes`);

        if (!response.ok) {
            throw new Error(
                `GET /notes failed: ${response.status}`
            );
        }

        allNotes =
            await response.json();

        renderNotes(allNotes);

    } catch (error) {

        console.error(
            "Load notes error:",
            error
        );

        notesContainer.innerHTML = `
            <div class="loading">
                Unable to load notes.
                <br>
                Check the browser console for details.
            </div>
        `;

        showToast(
            "Unable to load notes"
        );
    }
}


// ============================================
// RENDER NOTES
// ============================================

function renderNotes(notes) {

    notesContainer.innerHTML = "";

    noteCount.textContent =
        notes.length;


    // No notes

    if (notes.length === 0) {

        emptyState.style.display =
            "block";

        return;
    }


    emptyState.style.display =
        "none";


    // Create cards

    notes.forEach(note => {

        const card =
            document.createElement("article");

        card.className =
            "note-card";


        card.innerHTML = `

            <h3 class="note-title">
                ${escapeHTML(note.title)}
            </h3>

            <p class="note-content">
                ${escapeHTML(note.content)}
            </p>

            <div class="note-footer">

                <span class="note-id">
                    ${note.noteId.substring(0, 8)}...
                </span>

                <div class="note-actions">

                    <button
                        class="note-action"
                        title="Edit note"
                        data-action="edit"
                        data-id="${note.noteId}"
                    >
                        ✎
                    </button>

                    <button
                        class="note-action delete"
                        title="Delete note"
                        data-action="delete"
                        data-id="${note.noteId}"
                    >
                        ×
                    </button>

                </div>

            </div>
        `;


        notesContainer.appendChild(card);

    });
}


// ============================================
// CREATE NOTE
// ============================================

noteForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            titleInput.value.trim();

        const content =
            contentInput.value.trim();


        if (!title || !content) {

            showToast(
                "Please fill in both fields"
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/notes`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            title: title,
                            content: content
                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `POST failed: ${response.status}`
                );
            }


            await response.json();


            closeNoteModal();


            titleInput.value = "";

            contentInput.value = "";


            showToast(
                "Note created successfully"
            );


            await loadNotes();


        } catch (error) {

            console.error(
                "Create note error:",
                error
            );

            showToast(
                "Unable to create note"
            );
        }

    }
);


// ============================================
// DELETE NOTE
// ============================================

async function deleteNote(noteId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/notes/${noteId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                `DELETE failed: ${response.status}`
            );
        }


        showToast(
            "Note deleted successfully"
        );


        await loadNotes();


    } catch (error) {

        console.error(
            "Delete note error:",
            error
        );

        showToast(
            "Unable to delete note"
        );
    }
}


// ============================================
// EDIT NOTE
// ============================================

async function editNote(noteId) {

    // Find existing note

    const note =
        allNotes.find(
            item =>
                item.noteId === noteId
        );


    if (!note) {

        showToast(
            "Note not found"
        );

        return;
    }


    const newTitle =
        prompt(
            "Enter new title:",
            note.title
        );


    if (newTitle === null) {
        return;
    }


    const newContent =
        prompt(
            "Enter new content:",
            note.content
        );


    if (newContent === null) {
        return;
    }


    const title =
        newTitle.trim();

    const content =
        newContent.trim();


    if (!title || !content) {

        showToast(
            "Title and content are required"
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/notes/${noteId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        title: title,
                        content: content
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `PUT failed: ${response.status}`
            );
        }


        showToast(
            "Note updated successfully"
        );


        await loadNotes();


    } catch (error) {

        console.error(
            "Update note error:",
            error
        );

        showToast(
            "Unable to update note"
        );
    }
}


// ============================================
// NOTE BUTTONS
// ============================================

notesContainer.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;

        const noteId =
            button.dataset.id;


        if (action === "delete") {

            deleteNote(noteId);

        }


        if (action === "edit") {

            editNote(noteId);

        }

    }
);


// ============================================
// SEARCH
// ============================================

searchInput.addEventListener(
    "input",
    function () {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        if (!query) {

            renderNotes(allNotes);

            return;
        }


        const filtered =
            allNotes.filter(note =>

                note.title
                    .toLowerCase()
                    .includes(query)

                ||

                note.content
                    .toLowerCase()
                    .includes(query)

            );


        renderNotes(filtered);

    }
);


// ============================================
// OPEN MODAL
// ============================================

function openNoteModal() {

    modalOverlay.classList.add(
        "show"
    );


    setTimeout(
        () => titleInput.focus(),
        100
    );
}


// ============================================
// CLOSE MODAL
// ============================================

function closeNoteModal() {

    modalOverlay.classList.remove(
        "show"
    );
}


// ============================================
// MODAL EVENTS
// ============================================

newNoteButton.addEventListener(
    "click",
    openNoteModal
);

emptyCreateButton.addEventListener(
    "click",
    openNoteModal
);

closeModal.addEventListener(
    "click",
    closeNoteModal
);

cancelButton.addEventListener(
    "click",
    closeNoteModal
);


modalOverlay.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalOverlay
        ) {

            closeNoteModal();

        }

    }
);


// ============================================
// ESCAPE KEY
// ============================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeNoteModal();

        }

    }
);


// ============================================
// TOAST
// ============================================

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );
}


// ============================================
// HTML SECURITY
// ============================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ============================================
// START APPLICATION
// ============================================

loadNotes();