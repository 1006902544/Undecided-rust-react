import { ManagerInfo } from '@/libs/api/schema';
import { Avatar } from 'antd';
import React, { useMemo } from 'react';
import maleAvatar from '@/assets/images/male-avatar.png';
import femaleAvatar from '@/assets/images/female-avatar.png';
import unknownAvatar from '@/assets/images/unknown-avatar.png';
import type { AvatarProps } from 'antd/lib';

interface IAvatarProps extends AvatarProps {
  auth?: ManagerInfo | null;
}

export default function AvatarContainer({ auth, ...props }: IAvatarProps) {
  const avatar = useMemo(() => {
    if (auth?.avatar) {
      return auth.avatar;
    } else {
      if (auth?.gender === 1) {
        return maleAvatar;
      } else if (auth?.gender === 2) {
        return femaleAvatar;
      } else {
        return unknownAvatar;
      }
    }
  }, [auth]);

  return <Avatar src={avatar} {...props} />;
}
