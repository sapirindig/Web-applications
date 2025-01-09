import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import {Express} from "express";
import userModel, { IUser } from "../models/user_model"; 
import postModel from "../models/post_model";

let app: Express;


beforeAll(async()=>{
    app= await initApp();
    console.log('beforeAll'); 
    await userModel.deleteMany();
    await postModel.deleteMany();
});

afterAll(async()=>{
    console.log('afterAll'); 
    //await postModel.deleteMany();
    await mongoose.connection.close();
}); 

type User = IUser & {
    accessToken?: string,
    refreshToken?: string
  };
  
  const testUser: User = {
    email: "test@user.com",
    password: "testpassword",
  }

describe("auth tests", () => {
    test("Auth test register", async () => {
        const response = await request(app).post("/auth" + "/register").send(testUser);
        expect(response.statusCode).toBe(200);
      });

      test("Auth test register fail", async () => {
        const response = await request(app).post("/auth" + "/register").send(testUser);
        expect(response.statusCode).not.toBe(200);
      });

    test ("Auth Login",async () => {
        const response= await request(app).post("/auth/login").send({
            email: testUser.email,
            password: testUser.password
        });
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        expect(token).toBeDefined();
        const userId = response.body._id;
        expect(userId).toBeDefined();
        testUser.accessToken=token;
        testUser._id=userId;
    }); 
    
   test ("Get protected API",async () => {
        const response= await request(app).post("/posts").send({
            title: "my first post",
            content: "this is my first post",
            owner: testUser._id
        });
        expect(response.statusCode).not.toBe(201);
        const response2= await request(app).post("/posts").set({
            Authorization: `Bearer ${testUser.accessToken}`
        }).send({
            title: "my first post",
            content: "this is my first post",
            owner: testUser._id
        });
        expect(response2.statusCode).toBe(201);
    });

    test ("Get protected API invalid token",async () => {
        const response= await request(app).post("/posts").set({
        Authorization: `Bearer ${testUser.accessToken}` +1
        }).send({
            title: "my first post",
            content: "this is my first post",
            owner: testUser._id
        });
        expect(response.statusCode).not.toBe(201);
  
    });
 });
