import { AssetEntity } from './asset.entity'
import { MintInfoEntity } from './mint-info.entity'
import { MintMethodEntity } from './mint-method.entity'
import { ProjectHasAssetEntity } from './project-has-asset.entity'
import { ProjectHasMintInfoEntity } from './project-has-mint-info.entity'
import { ProjectHasUserVotingEntity } from './project-has-user-voting.entity'
import { ProjectEntity } from './project.entity'
import { VotingEntity } from './voting.entity'

export const Entities = [
  AssetEntity,
  MintInfoEntity,
  MintMethodEntity,
  ProjectHasAssetEntity,
  ProjectEntity,
  ProjectHasMintInfoEntity,
  VotingEntity,
  ProjectHasUserVotingEntity,
]
