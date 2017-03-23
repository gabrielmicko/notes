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
import { login, getToken, isToken } from './jwt';
import { encrypt, decrypt } from './encrypt';

const Notes = new GraphQLObjectType({
  name: 'Notes',
  description: 'This is the Notes table handler.',
    fields: () => {
      return {
        id: {
          type: GraphQLInt,
          resolve(note) {
            return note.id;
          },
        },
        url: {
          type: GraphQLString,
          resolve(note) {
            return decrypt(note.url);
          },
        },
        title: {
          type: GraphQLString,
          resolve(note) {
            return decrypt(note.title);
          },
        },
        text: {
          type: GraphQLString,
          resolve(note) {
            return decrypt(note.text);
          },
        },
        private: {
          type: GraphQLBoolean,
          resolve(note) {
            return note.private;
          },
        },
        deleted: {
          type: GraphQLBoolean,
          resolve(note) {
            return note.deleted;
          },
        },
        createdAt: {
          type: GraphQLString,
          resolve(note) {
            return moment(note.createdAt).format('MMMM Do YYYY, h:mm:ss a');
          },
        },
        updatedAt: {
          type: GraphQLString,
          resolve(note) {
            return moment(note.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
          },
        },
      };
    },
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
          },
        },
        username: {
          type: GraphQLString,
          resolve(user) {
            return user.username;
          },
        },
        token: {
          type: GraphQLString,
          resolve(user) {
            return user.token || false;
          },
        },
      };
    },
});

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
          },
        },
        resolve(root, args) {
          args.private = false;
          if(args.token && isToken(args.token)) {
            delete args.private;
          }

          if(args.token) {
            delete args.token;
          }
          args.deleted = false;
          
          return Db.models.notes.findAll({
            where: args
          });
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
          return new Promise((resolve) => {
            let result = Db.models.users.findAll({
              where: {
                username: args.username,
              },
              raw: true
            });
            
            result.then((users) => {
              console.log('l');
            console.log(users);
              if(users.length > 0) {
                console.log(args.password);
                console.log(users[0].password);
                var comparePw = bcrypt.compareSync(args.password, users[0].password);
                console.log(comparePw);
                if(comparePw) {
                  users[0].token = login(users[0].username);
                  resolve(users);
                }
              }
              resolve([]);
            });
          });
        }
      },
    }
  },
});


const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Mutations.',
  fields() {
    return {
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
            },
          },
        resolve(root, args) {
            if(args.token && isToken(args.token)) {
              return new Promise((resolve) => {
                var createNote =Db.models.notes.create({
                  url: encrypt(args.url),
                  title: encrypt(args.title),
                  text: encrypt(args.text),
                  private: args.private
                }, {
                  raw: true
                });
                createNote.then((newNote) => {
                  resolve(Db.models.notes.findAll({
                    where: {
                      id: newNote.id,
                      deleted: false
                    }
                  }))
                });
              });
            }
            else {
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
              type: new GraphQLNonNull(GraphQLString),
            },
            title: {
              type: new GraphQLNonNull(GraphQLString),
            },
            text: {
              type: new GraphQLNonNull(GraphQLString),
            },
            private: {
              type: GraphQLBoolean
            },
          },
        resolve(root, args) {
            if(args.token && isToken(args.token)) {
              return new Promise((resolve) => {
                delete args.token;
                if(args.url) {
                  args.url = encrypt(args.url);
                }
                if(args.title) {
                  args.title = encrypt(args.title);
                }
                if(args.text) {
                  args.text = encrypt(args.text);
                }
                var updateNote = Db.models.notes.update(
                  args,
                  {
                    where: {
                      id: args.id,
                      deleted: false
                    }
                  }
                );
                
                updateNote.then(() => {
                  resolve(Db.models.notes.findAll({
                    where: {
                      id: args.id
                    }
                  }))
                });
                
              });
            }
            else {
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
            },
          },
        resolve(root, args) {
            if(args.token && isToken(args.token)) {
              return new Promise((resolve) => {
                delete args.token;
                var updateNote = Db.models.notes.update(
                  {
                    deleted: true
                  },
                  {
                    where: {
                      id: args.id
                    }
                  }
                );
                
                updateNote.then(() => {
                  resolve(Db.models.notes.findAll({
                    where: {
                      id: args.id
                    }
                  }))
                });
                
              });
            }
            else {
              return [];
            }
        }
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default Schema;
