import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { SayartawsService } from './sayartaws.service';
import { SayartawEntity } from './entities/sayartaw.entity';
import { CreateSayartawInput } from './dto/create-sayartaw.input';
import { UpdateSayartawInput } from './dto/update-sayartaw.input';
import { TayartawEntity } from 'src/tayartaws/entities/tayartaw.entity';
import { forwardRef, Inject } from '@nestjs/common';
import { TayartawsService } from 'src/tayartaws/tayartaws.service';

@Resolver(() => SayartawEntity)
export class SayartawsResolver {
  constructor(
    private readonly sayartawsService: SayartawsService,
    @Inject(forwardRef(() => TayartawsService))
    private tayartawsService: TayartawsService,
  ) {}

  @Mutation(() => SayartawEntity)
  createSayartaw(
    @Args('createSayartawInput') createSayartawInput: CreateSayartawInput,
  ) {
    return this.sayartawsService.create(createSayartawInput);
  }

  @Query(() => [SayartawEntity], { name: 'sayartaws' })
  findAll() {
    return this.sayartawsService.findAll();
  }

  @Query(() => SayartawEntity, { name: 'sayartaw' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.sayartawsService.findOne(id);
  }

  @Mutation(() => SayartawEntity)
  updateSayartaw(
    @Args('updateSayartawInput') updateSayartawInput: UpdateSayartawInput,
  ) {
    return this.sayartawsService.update(
      updateSayartawInput.id,
      updateSayartawInput,
    );
  }

  @Mutation(() => SayartawEntity)
  removeSayartaw(@Args('id', { type: () => String }) id: string) {
    return this.sayartawsService.remove(id);
  }

  // NOTE: ResolveFields
  @ResolveField(() => [TayartawEntity], { name: 'tayartaws' })
  tayartaws(@Parent() sayartaw: SayartawEntity) {
    return this.tayartawsService.findAllBySayartawID(sayartaw.id);
  }
}
