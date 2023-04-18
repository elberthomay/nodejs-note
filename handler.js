const Ajv = require('ajv')
const { v4: uuidv4 } = require('uuid');
const noteSchema = {
    type: 'object',
    properties: {
        "title": {type: 'string'}, 
        "tags": {type: 'array', 
               items: {
                type: 'string'
               }},
        "body": {type: 'string'}
    }
}

const ajv = new Ajv()
const noteValidator = ajv.compile(noteSchema)    //validator object
const notes = []

function getAllNotes(h){
    return h.response(JSON.stringify({
        "status": "success",
        "data": {
            "notes": notes
        }
    })).code(200).type("application/JSON")
}

function getNoteById(h, id){
    const note = notes.find(note => note.id === id)
    if(note){
        return h.response(JSON.stringify({
            "status": "success",
            "data": {
                "note": note
            }
        })).code(200).type("application/JSON")
    }else{
        return h.response(JSON.stringify({
            "status": "fail",
            "message": "Catatan Tidak Ditemukan"
        })).code(404).type("application/JSON")
    }
}

function createNote(request, h){
    try{
        const noteInput = request.payload   //take POST payload

        if(!noteValidator(noteInput)) //throw error if variable fail to validate
            throw new Error("wrong json")
        const {title, tags, body} = noteInput   //deconstruct noteInput

        let id      //create unique id
        do{id = uuidv4()} while(notes.findIndex((note) => note.id === id) !== -1)

        const createdAt = (new Date()).toISOString()    //create current time in string
        notes.push({    //push new note
            id,
            title,
            createdAt,
            updatedAt: createdAt,
            tags,
            body
        })
        return h.response(JSON.stringify({
            "status": "success",
            "message": "Catatan berhasil ditambahkan",
            "data": {
              "noteId": id
            }
          })).code(201).type('application/JSON')
    }catch(error){
        return h.response(JSON.stringify({
            "status": "error",
            "message": "Catatan gagal untuk ditambahkan"
          })).code(500).type('application/JSON')
    }
}

function changeNote(request, h){
    const {id = ""} = request.params
    const noteIndex = notes.findIndex(note => note.id === id)
    if(noteIndex !== -1){
        const noteModified = request.payload
        if(noteValidator(noteModified)){
            const {title, tags, body} = noteModified
            const updatedAt = (new Date()).toISOString()
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                tags,
                body,
                updatedAt
            }

            return h.response(JSON.stringify({
                "status": "success",
                "message": "Catatan berhasil diperbaharui"
            })).code(200).type("application/JSON")

        }else{
            return h.response(JSON.stringify({
                "status": "fail",
                "message": "format JSON salah. Format: {title: <string>, tags: [<string>... ], body: <string>}"
            })).code(400).type("application/JSON")
        }
    }else{
        return h.response(JSON.stringify({
            "status": "fail",
            "message": "Gagal memperbaharui catatan. Id catatan tidak ditemukan."
        }))
    }
}

function deleteNote(request, h){
    const {id = ""} = request.params
    const noteIndex = notes.findIndex(note => note.id === id)
    if(noteIndex !== -1){
        notes.splice(noteIndex, 1)
        return h.response(JSON.stringify({
            "status": "success",
            "message": "Catatan berhasil dihapus"
        }))

    }else{
        return h.response(JSON.stringify({
            "status": "fail",
            "message": "Gagal merubah catatan. Id catatan tidak ditemukan."
        }))
    }
}

module.exports = {getAllNotes, getNoteById, changeNote, createNote, deleteNote}