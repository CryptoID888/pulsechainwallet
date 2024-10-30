import * as sql from '$main/sql';
import { Contact } from "$common/types";
import { handle, emit } from "$main/ipc";

handle('contact:all', () => {
  return sql.query.all('CONTACT_ALL', [])
})

handle('contact:upsert', (contact: Contact) => {
  sql.query.run('CONTACT_UPSERT', [contact])
  emit('contacts', sql.query.all('CONTACT_ALL', []))
})
