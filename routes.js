const {getAllNotes, getNoteById, createNote, changeNote, deleteNote} = require('./handler')

const routes = [{   //receive note payload {title:<string>, tags:[<string>...], body:<string>}
    method: "POST",
    path: "/notes",
    handler: createNote

},{     //get notes, return all notes when there's no id
    method: "GET",
    path: "/notes/{id?}",
    handler: (request, h) => {
        const {id = ""} = request.params
        if(id === "") return getAllNotes(h)
        else return getNoteById(h, id)
    }
},{
    method: "PUT",
    path: "/notes/{id}",
    handler: changeNote
},{
    method: "DELETE",
    path: "/notes/{id}",
    handler: deleteNote
}]
module.exports = routes