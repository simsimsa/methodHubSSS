import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { RegisterDto, LoginDto, AuthResponseDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      name,
      isAdmin: false,
      isBanned: false,
    });

    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.isBanned) {
      throw new UnauthorizedException("User account is banned");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  }

  async validateUser(userId: number): Promise<Record<string, any> | null> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.isBanned) return null;

    const { passwordHash: _unused, ...userProfile } = user;
    return userProfile;
  }

  async getProfile(userId: number): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const { passwordHash: _unused, ...userProfile } = user;
    return userProfile;
  }
}


