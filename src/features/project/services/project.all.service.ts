import { Types } from "mongoose";
import { Project } from "../models/projects.model";
import { ProjectLike } from "../models/projects.likes.model";
import { AppError } from "../../../common/errors/app.error";

type UserPersonalInfo = {
  personalInfo: {
    profilePicture: string;
    username: string;
    profession: string;
  };
};

// Base Project Type
export type ProjectBaseType = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  projectUrl: string;
  projectImage: ProjectImage[]; // Properly typed
  projectThumbnail?: string;
  tags: Types.ObjectId[];
  userId: Types.ObjectId | UserPersonalInfo;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectImage = {
  _id: Types.ObjectId;
  url: string;
};

// Project with Like Status
export type ProjectWithLikeStatus = ProjectBaseType & {
  likedByUser: boolean;
  likeCount: number;
};

// Fetch All Projects Function
export const fetchAllProjects = async (userId: string): Promise<ProjectWithLikeStatus[]> => {
  try {
    // Fetch all projects and populate userId fields
    const projects = await Project.find().populate("userId", "personalInfo.profilePicture personalInfo.username personalInfo.profession").exec();

    if (!projects || projects.length === 0) {
      throw new AppError("No projects found", 404);
    }

    // Fetch liked projects by the user
    const likedProjects = await ProjectLike.find({ userId }).select("projectId").exec();
    const likedProjectIds = likedProjects.map((like) => like.projectId.toString());

    // Map projects and ensure projectImage is properly formatted
    const projectsWithLikedStatus: ProjectWithLikeStatus[] = await Promise.all(
      projects.map(async (project) => {
        const likeCount = await ProjectLike.countDocuments({ projectId: project._id });

        return {
          ...project.toObject(),
          projectImage: project.projectImage.map((img) => ({
            _id: img._id,
            url: img.url,
          })), // Ensures proper formatting of projectImage
          likedByUser: likedProjectIds.includes(project._id.toString()),
          likeCount,
        };
      })
    );

    return projectsWithLikedStatus;
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    throw new AppError(error.message || "An error occurred while fetching projects", 500);
  }
};
