import { AssetController } from './asset/controller/asset.controllers'
import { MintMethodController } from './mint-method/controller/mint-method.controllers'
import { ProjectController } from './project/controller/project.controllers'
import { VotingController } from './voting/controller/voting.controllers'

export const Controllers = [ProjectController, AssetController, MintMethodController, VotingController]
