import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { prisma } from "@realestate-crm/db";
import { LoginDto, RegisterDto, AuthResponseDto } from "./dto/auth.dto";
import { UserRole } from "../users/dto/user.dto";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { agency: true },
    });

    if (user && (await bcrypt.compare(password, user.password || ""))) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserById(id: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { agency: true },
    });

    if (user) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      email: user.email,
      sub: user.id,
      agencyId: user.agencyId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: "7d" }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        agencyId: user.agencyId,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: registerDto.email, deletedAt: null },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: UserRole.AGENT,
        agencyId: registerDto.agencyId || (await this.getDefaultAgency()).id,
      },
      include: { agency: true },
    });

    const payload = {
      email: user.email,
      sub: user.id,
      agencyId: user.agencyId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: "7d" }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        agencyId: user.agencyId,
      },
    };
  }

  private async getDefaultAgency() {
    let agency = await prisma.agency.findFirst({
      where: { deletedAt: null },
    });

    if (!agency) {
      agency = await prisma.agency.create({
        data: {
          name: "Default Agency",
        },
      });
    }

    return agency;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.validateUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        agencyId: user.agencyId,
      };
      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
