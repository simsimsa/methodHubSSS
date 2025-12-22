import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../types/database.types";
import { UpdateUserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<Omit<User, "passwordHash">[]> {
    const users = await this.userRepository.findAll();
    return users.map(({ passwordHash: _unused, ...user }) => user);
  }

  async findOne(id: number): Promise<Omit<User, "passwordHash">> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { passwordHash: _unused, ...userProfile } = user;
    return userProfile;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, "passwordHash">> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = await this.userRepository.update(id, updateUserDto);
    if (!updated) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { passwordHash: _unused, ...userProfile } = updated;
    return userProfile;
  }
}
