import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TayartawsService } from './tayartaws.service';
import { CreateTayartawInput } from './dto/create-tayartaw.input';
import { UpdateTayartawInput } from './dto/update-tayartaw.input';
import { TayartawEntity } from './entities/tayartaw.entity';
import { SayartawEntity } from 'src/sayartaws/entities/sayartaw.entity';
import { SayartawsService } from 'src/sayartaws/sayartaws.service';
import { forwardRef, Inject } from '@nestjs/common';

@Resolver(() => TayartawEntity)
export class TayartawsResolver {
  constructor(
    private readonly tayartawsService: TayartawsService,
    @Inject(forwardRef(() => SayartawsService))
    private readonly sayartawSerivce: SayartawsService,
  ) {}

  @Mutation(() => TayartawEntity)
  createTayartaw(
    @Args('createTayartawInput') createTayartawInput: CreateTayartawInput,
  ) {
    return this.tayartawsService.create(createTayartawInput);
  }

  @Query(() => [TayartawEntity], { name: 'tayartaws' })
  findAll() {
    return this.tayartawsService.findAll();
  }

  @Query(() => TayartawEntity, { name: 'tayartaw' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.tayartawsService.findOne(id);
  }

  @Mutation(() => TayartawEntity)
  updateTayartaw(
    @Args('updateTayartawInput') updateTayartawInput: UpdateTayartawInput,
  ) {
    return this.tayartawsService.update(updateTayartawInput);
  }

  @Mutation(() => TayartawEntity)
  removeTayartaw(@Args('id', { type: () => String }) id: string) {
    return this.tayartawsService.remove(id);
  }

  @ResolveField(() => SayartawEntity, { name: 'sayartaw' })
  sayartaw(@Parent() tayartaw: TayartawEntity) {
    return this.sayartawSerivce.findOne(tayartaw.sayartawId);
  }
}
