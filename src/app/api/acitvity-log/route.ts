import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";