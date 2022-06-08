import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => CategoryEntity)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => CategoryEntity)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [CategoryEntity], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => CategoryEntity, { name: 'category' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => CategoryEntity)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => CategoryEntity)
  removeCategory(@Args('id', { type: () => String }) id: string) {
    return this.categoriesService.remove(id);
  }
}
