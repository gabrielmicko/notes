import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} from 'graphql';
import moment from 'moment';
import bcrypt from 'bcrypt';
import Db from './db';
import { login, getToken, isToken, getID } from './jwt';
import { encrypt, decrypt } from './encrypt';
import Config from '../Config/config.json';

Db.sync({
  force: Config.forceRewriteDB
});

function validateEmail(email) {
  if (email.indexOf('@') !== -1) {
    return true;
  }
  return false;
}

const Notes = new GraphQLObjectType({
  name: 'Notes',
  description: 'This is the Notes table handler.',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(note) {
          return note.id;
        }
      },
      userId: {
        type: GraphQLInt,
        resolve(note) {
          return note.userId;
        }
      },
      url: {
        type: GraphQLString,
        resolve(note) {
          return decrypt(note.url);
        }
      },
      title: {
        type: GraphQLString,
        resolve(note) {
          return decrypt(note.title);
        }
      },
      text: {
        type: GraphQLString,
        resolve(note) {
          return decrypt(note.text);
        }
      },
      private: {
        type: GraphQLBoolean,
        resolve(note) {
          return note.private;
        }
      },
      deleted: {
        type: GraphQLBoolean,
        resolve(note) {
          return note.deleted;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve(note) {
          return moment(note.createdAt).format('MMMM Do YYYY, h:mm:ss a');
        }
      },
      updatedAt: {
        type: GraphQLString,
        resolve(note) {
          return moment(note.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
        }
      }
    };
  }
});

const Users = new GraphQLObjectType({
  name: 'Users',
  description: 'This is the Users table handler.',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        }
      },
      username: {
        type: GraphQLString,
        resolve(user) {
          return user.username;
        }
      },
      token: {
        type: GraphQLString,
        resolve(user) {
          return user.token || false;
        }
      }
    };
  }
});
//
// const Message = new GraphQLObjectType({
//   name: 'Message',
//   description: 'Adding messages to components.',
//   fields: () => {
//     return {
//       code: {
//         type: GraphQLInt,
//         resolve(error) {
//           return error.code;
//         }
//       },
//       msg: {
//         type: GraphQLString,
//         resolve(error) {
//           return error.msg;
//         }
//       }
//     };
//   }
// });
//
// const UserWithMessage = new GraphQLObjectType({
//   name: 'UserWithMessage',
//   description: 'User with any message.',
//   fields: () => {
//     return {
//       message: {
//         type: new GraphQLList(Message),
//         resolve(message) {
//           return message.message;
//         }
//       },
//       user: {
//         type: Users,
//         resolve(message) {
//           return message.user;
//         }
//       }
//     };
//   }
// });

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return {
      notes: {
        type: new GraphQLList(Notes),
        args: {
          token: {
            type: GraphQLString
          },
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          if (args.token && isToken(args.token)) {
            args.userId = getID(args.token);
            delete args.token;
            args.deleted = false;

            return Db.models.notes.findAll({
              where: args,
              raw: true
            });
          } else {
            return Db.models.notes.findAll({
              where: {
                id: args.id,
                private: false
              },
              raw: true
            });
          }
          return [];
        }
      },
      auth: {
        type: new GraphQLList(Users),
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, args) {
          return new Promise(resolve => {
            let result = Db.models.users.findAll({
              where: {
                username: args.username
              },
              raw: true
            });

            result.then(users => {
              if (users.length > 0) {
                var comparePw = bcrypt.compareSync(
                  args.password,
                  users[0].password
                );
                if (comparePw) {
                  users[0].token = login(users[0].id);
                  resolve(users);
                }
              }
              resolve([]);
            });
          });
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Mutations.',
  fields() {
    return {
      registerUser: {
        type: new GraphQLList(Users),
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, args) {
          if (
            args.username.toString().length > 3 &&
            args.password.toString().length > 3 &&
            validateEmail(args.username)
          ) {
            const createUser = Db.models.users.create(
              {
                username: args.username,
                password: bcrypt.hashSync(args.password, 10)
              },
              {
                raw: true
              }
            );
            const createUserPromise = new Promise(resolve => {
              createUser.then(
                user => {
                  resolve([user]);
                },
                reject => {
                  resolve([]);
                }
              );
            });
            return createUserPromise;
          } else {
            throw new Error('The email or password is incorrect.');
          }
        }
      },
      addNote: {
        type: new GraphQLList(Notes),
        args: {
          token: {
            type: new GraphQLNonNull(GraphQLString)
          },
          url: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          },
          private: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve(root, args) {
          if (args.token && isToken(args.token)) {
            return new Promise(resolve => {
              var createNote = Db.models.notes.create(
                {
                  url: encrypt(args.url),
                  title: encrypt(args.title),
                  text: encrypt(args.text),
                  private: args.private,
                  userId: getID(args.token)
                },
                {
                  raw: true
                }
              );
              createNote.then(newNote => {
                resolve(
                  Db.models.notes.findAll({
                    where: {
                      id: newNote.id,
                      deleted: false
                    }
                  })
                );
              });
            });
          } else {
            return [];
          }
        }
      },
      editNote: {
        type: new GraphQLList(Notes),
        args: {
          token: {
            type: new GraphQLNonNull(GraphQLString)
          },
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          url: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          },
          private: {
            type: GraphQLBoolean
          }
        },
        resolve(root, args) {
          if (args.token && isToken(args.token)) {
            return new Promise(resolve => {
              const token = args.token;
              delete args.token;
              if (args.url) {
                args.url = encrypt(args.url);
              }
              if (args.title) {
                args.title = encrypt(args.title);
              }
              if (args.text) {
                args.text = encrypt(args.text);
              }
              var updateNote = Db.models.notes.update(args, {
                where: {
                  id: args.id,
                  deleted: false,
                  userId: getID(token)
                }
              });

              updateNote.then(() => {
                resolve(
                  Db.models.notes.findAll({
                    where: {
                      id: args.id
                    }
                  })
                );
              });
            });
          } else {
            return [];
          }
        }
      },
      deleteNote: {
        type: new GraphQLList(Notes),
        args: {
          token: {
            type: new GraphQLNonNull(GraphQLString)
          },
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(root, args) {
          if (args.token && isToken(args.token)) {
            return new Promise(resolve => {
              const userId = getID(args.token);
              const updateNote = Db.models.notes.update(
                {
                  deleted: true
                },
                {
                  where: {
                    id: args.id,
                    userId: userId
                  }
                }
              );

              updateNote.then(() => {
                resolve(
                  Db.models.notes.findAll({
                    where: {
                      id: args.id,
                      userId: userId
                    }
                  })
                );
              });
            });
          } else {
            return [];
          }
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
