const FoldersService = {
    getFolders (knex) {
        return knex
            .select('*')
            .from('folders')
    },
    getById (knex, id) {
        return knex
            .select('*')
            .from('folders')
            .where('id', id)
            .first()
    },
    createFolder (knex, newFolder) {
        return knex
            .insert(newFolder)
            .into('folders')
            .returning('*')
            .then(rows => rows[0])
    },
    deleteFolder (knex, id) {
        return knex('folders')
            .where('id',id)
            .delete()
    },
    updateFolder (knex, id, newName) {
        return knex('folders')
            .where('id', id)
            .update(newName)
    }
}

module.exports = FoldersService