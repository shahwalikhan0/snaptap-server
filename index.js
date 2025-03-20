const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { GraphQLUpload, graphqlUploadExpress } = require("graphql-upload");
const fs = require("fs-extra");
const path = require("path");
const http = require("http");
const cors = require("cors");
const { pipeline } = require("stream");
const util = require("util");
const pipelineAsync = util.promisify(pipeline);

// Create Express app and HTTP server
const app = express();
const httpServer = http.createServer(app);

// Middleware setup
app.use(cors());
app.use(graphqlUploadExpress({ maxFileSize: 20000000, maxFiles: 1 })); // 20MB max file size

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// GraphQL Schema
const typeDefs = gql`
  scalar Upload

  type Query {
    hello: String
  }

  type Mutation {
    uploadModel(file: Upload!): String!
  }
`;

// Resolvers
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    hello: () => "Hello from GraphQL!",
  },
  Mutation: {
    uploadModel: async (_, { file }) => {
      try {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();

        if (!filename.endsWith(".usdz")) {
          console.log("Invalid file type. Only .usdz files are allowed.");
          return "Invalid file type. Only .usdz files are allowed.";
        }
        const uploadDir = path.join(__dirname, "uploads");
        await fs.ensureDir(uploadDir);

        const filePath = path.join(uploadDir, filename);
        const writeStream = fs.createWriteStream(filePath);

        await pipelineAsync(stream, writeStream);
        console.log("File upload completed");

        convertFile(filePath);

        return `File uploaded successfully: ${filename}`;
      } catch (error) {
        console.error("File upload failed:", error);
        throw new Error("Failed to upload file");
      }
    },
  },
};

// Convert USDZ to GLB
async function convertFile(usdzFile) {
  // blender -b -P /Users/shahwalikhan/Desktop/test/convert.py -- /Users/shahwalikhan/Desktop/snaptap-server/model-mobile.usdz  /Users/shahwalikhan/Desktop/snaptap-server/model-mobile.glb
  const glbFile = usdzFile.replace(".usdz", ".glb");
  const convertScript = path.join(__dirname, "convert.py");

  const { exec } = require("child_process");
  exec(
    `blender -b -P ${convertScript} -- ${usdzFile} ${glbFile}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Conversion failed: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Conversion failed: ${stderr}`);
        return;
      }
      console.log(`Conversion successful: ${stdout}`);
    }
  );
}

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
}
startServer();
