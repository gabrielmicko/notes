import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} from 'graphql';
import Db from './db';
import { login, getToken, isToken } from './jwt';

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
            return note.url;
          },
        },
        title: {
          type: GraphQLString,
          resolve(note) {
            return note.title;
          },
        },
        text: {
          type: GraphQLString,
          resolve(note) {
            return note.text;
          },
        },
        private: {
          type: GraphQLBoolean,
          resolve(note) {
            return note.private;
          },
        },
        createdAt: {
          type: GraphQLString,
          resolve(note) {
            return note.createdAt;
          },
        },
        updatedAt: {
          type: GraphQLString,
          resolve(note) {
            return note.updatedAt;
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
          console.log('ARGO');
          console.log(args);
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
              where: args,
              raw: true
            });
            result.then((users) => {
              if(users.length > 0) {
                users[0].token = login(users[0].username);
                resolve(users);
              }
              else {
                resolve([]);
              }
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
                  url: args.url,
                  title: args.title,
                  text: args.text,
                  private: args.private
                }, {
                  raw: true
                });
                createNote.then((newNote) => {
                  resolve(Db.models.notes.findAll({
                    where: {
                      id: newNote.id
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
              type: GraphQLString
            },
            title: {
              type: GraphQLString
            },
            text: {
              type: GraphQLString
            },
            private: {
              type: GraphQLBoolean
            },
          },
        resolve(root, args) {
            if(args.token && isToken(args.token)) {
              return new Promise((resolve) => {
                delete args.token;
                var updateNote = Db.models.notes.update(
                  args,
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
