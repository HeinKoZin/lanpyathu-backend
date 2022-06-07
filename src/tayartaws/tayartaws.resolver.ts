import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TayartawsService } from './tayartaws.service';
import { CreateTayartawInput } from './dto/create-tayartaw.input';
import { UpdateTayartawInput } from './dto/update-tayartaw.input';
import { TayartawEntity } from './entities/tayartaw.entity';

@Resolver(() => TayartawEntity)
export class TayartawsResolver {
  constructor(private readonly tayartawsService: TayartawsService) {}

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
}
