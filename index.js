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

// Paths
const uploadDir = path.join(__dirname, "uploads");
const dataFile = path.join(__dirname, "uploads/models.json");

// Ensure uploads directory and data file exist
fs.ensureDirSync(uploadDir);
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));

// GraphQL Schema
const typeDefs = gql`
  scalar Upload

  type Query {
    hello: String
    getModels: [Model]
  }

  type Model {
    modelName: String
    productId: String
    productName: String
  }

  type Mutation {
    uploadModel(file: Upload!, productName: String!): String!
  }
`;

// Read data from models.json
function readData() {
  return JSON.parse(fs.readFileSync(dataFile));
}

// Write data to models.json
function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Resolvers
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    hello: () => "Hello from GraphQL!",
    getModels: () => readData(),
  },
  Mutation: {
    uploadModel: async (_, { file, productName }) => {
      try {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();

        if (!filename.endsWith(".usdz")) {
          console.log("Invalid file type. Only .usdz files are allowed.");
          return "Invalid file type. Only .usdz files are allowed.";
        }

        const filePath = path.join(uploadDir, filename);

        const writeStream = fs.createWriteStream(filePath);

        await pipelineAsync(stream, writeStream);
        console.log("File upload completed:", filename);

        // Await the conversion process
        await convertFile(filePath);

        // Store model data
        const productId = Date.now().toString();
        const modelName = path.basename(filename, ".usdz");

        const models = readData();
        const modelData = { modelName, productId, productName };
        models.push(modelData);
        writeData(models);

        return `File uploaded and model added: ${filename}`;
      } catch (error) {
        console.error("File upload failed:", error);
        throw new Error("Failed to upload file");
      }
    },
  },
};

// Convert USDZ to GLB
function convertFile(usdzFile) {
  return new Promise((resolve, reject) => {
    const glbFile = usdzFile.replace(".usdz", ".glb");
    const convertScript = path.join(__dirname, "convert.py");

    const { exec } = require("child_process");
    exec(
      `blender -b -P ${convertScript} -- ${usdzFile} ${glbFile}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Conversion failed1: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`Conversion failed2: ${stderr}`);
          reject(stderr);
        } else {
          console.log(`Conversion successful: ${stdout}`);
          resolve(stdout);
        }
      }
    );
  });
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
