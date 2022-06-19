import { AssetRepository } from './asset/repositories/asset.repository'
import { MintMethodRepository } from './mint-method/repositories/mint-method.repository'
import { ProjectHasAssetRepository } from './project/repositories/project-has-asset.repository'
import { ProjectRepository } from './project/repositories/project.repository'

export const Repositories = [ProjectRepository, AssetRepository, ProjectHasAssetRepository, MintMethodRepository]