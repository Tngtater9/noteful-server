const NotesService = {
    getNotes (knex) {
        return knex
            .select('*')
            .from('notes')
    },
    getById (knex, id) {
        return knex
            .select('*')
            .from('notes')
            .where({id})
            .first()
    },
    createNote (knex, newNote) {
        return knex
            .insert(newNote)
            .into('notes')
            .returning('*')
            .then(rows => rows[0])
    },
    deleteNote (knex, id) {
        return knex('notes')
            .where({id})
            .delete()
    },
    updateNote (knex, id, updatedNote) {
        return knex('folder')
            .where('id', id)
            .update(updatedNote)
    }
}

module.exports = NotesService