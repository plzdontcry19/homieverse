import { AssetService } from './asset/services/asset.service'
import { MintMethodService } from './mint-method/services/mint-method.service'
import { ProjectService } from './project/services/project.service'
import { VotingService } from './voting/services/voting.service'

export const Services = [ProjectService, AssetService, MintMethodService, VotingService]
