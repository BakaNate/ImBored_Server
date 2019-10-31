/**
 * Make any changes you need to make to the database here
 */
async function up () {
  // Write migration here
  await this('User').updateMany({}, {
    $delete: {docVersion}
  }, {multi: true});
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
