import React from 'react'
import { CTable } from '@coreui/react'

const Profile = () => {
  const columns = [
    {
      key: 'id',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'name',
      label: 'Name',
      _props: { scope: 'col' },
    },
    {
      key: 'gender',
      label: 'Gender',
      _props: { scope: 'col' },
    },
    {
      key: 'status',
      label: 'Status',
      _props: { scope: 'col' },
    },
  ]
  const items = [
    {
      id: 1,
      name: 'Mark',
      gender: 'Otto',
      status: '@mdo',
      _cellProps: { id: { scope: 'row' } },
    },
  ]
  return <CTable columns={columns} items={items} />
}

export default Profile
