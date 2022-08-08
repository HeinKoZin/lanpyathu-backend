import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryWithImageInput } from './dto/create-category-with-image.input';
import { SetCategoryWithImageInput } from './dto/set-category.input';
import { CategoryImageSharpPipe } from '@pipes/category-image-sharp.pipe';
import { SetUpdatedCategoryWithImageInput } from './dto/set-updated-category.input';
import { UpdateCategoryWithImageInput } from './dto/update-category-with-image.input';
import { UpdateCategoryImageSharpPipe } from '@pipes/update-category-image-sharp.pipe';

@Resolver(() => CategoryEntity)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => CategoryEntity)
  createCategory(
    @Args(
      'createCategoryInput',
      { type: () => CreateCategoryWithImageInput },
      CategoryImageSharpPipe,
    )
    setCategory: SetCategoryWithImageInput,
  ) {
    return this.categoriesService.create(setCategory);
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
    @Args(
      'updateCategoryInput',
      { type: () => UpdateCategoryWithImageInput },
      UpdateCategoryImageSharpPipe,
    )
    updateCategoryInput: SetUpdatedCategoryWithImageInput,
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

  // @Mutation(() => CategoryEntity)
  // createCategoryWithImage(
  //   @Args(
  //     'createCategoryInput',
  //     { type: () => CreateCategoryWithImageInput },
  //     CategoryImageSharpPipe,
  //   )
  //   setCategory: SetCategoryWithImageInput,
  // ) {
  //   return this.categoriesService.createWithImage(setCategory);
  // }
}
