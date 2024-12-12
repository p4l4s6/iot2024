export const SENSOR_COLUMN = [
  {
    field: 'id',
    header: 'ID',
    hidden: false
  },
  {
    field: 'name',
    header: 'Name',
    hidden: false
  },
  {
    field: 'desc',
    header: 'Description',
    hidden: false
  },
  {
    field: 'is_online',
    header: 'Is Online',
    hidden: false
  },
  {
    field: 'is_active',
    header: 'Is Active',
    hidden: false,
  },
  {
    field: 'uid',
    header: 'UID',
    hidden: true
  },
  {
    field: 'created_at',
    header: 'Created At',
    isDate: true,
    hidden: false
  },
  {
    field: 'updated_at',
    header: 'Updated At',
    isDate: true,
    hidden: false
  },{
    field: 'action',
    header: 'Action'
  }
 

];

export interface ISensor {
    id?: number,
    uid?: string,
    created_at?: string,
    updated_at?:string 
    name?: string,
    desc?: string,
    is_online: boolean,
    is_active: boolean
}
