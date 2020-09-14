export const zql = `
query L2Network.uuid where(
    (
        uuid in (
            query L2Network.uuid where type = 'L2NoVlanNetwork'
            and physicalInterface not in (
                query L2Network.physicalInterface where type = 'L2NoVlanNetwork'
                and uuid in (
                    query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                )
            ) 
        ) or uuid in (
            query L2Network.uuid where type = 'L2VlanNetwork'
            and(
                uuid in (
                    query L2Network.uuid where type = 'L2VlanNetwork'
                    and(
                        physicalInterface in (
                            query L2Network.physicalInterface where type = 'L2VlanNetwork'
                            and uuid in (
                                query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                            )
                        ) and uuid in (
                            query L2VlanNetwork.uuid where type = 'L2VlanNetwork'
                            and vlan not in (
                                query L2VlanNetwork.vlan where type = 'L2VlanNetwork'
                                and uuid in (
                                    query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                                )
                            )
                        )
                    )
                ) or uuid in (query L2Network.uuid where type = 'L2VlanNetwork'
                    and(physicalInterface not in (
                        query L2Network.physicalInterface where type = 'L2VlanNetwork'
                        and uuid in (
                            query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                        )
                    ) and uuid in (
                        query L2VlanNetwork.uuid where type = 'L2VlanNetwork'
                        and vlan not in (
                            query L2VlanNetwork.vlan where type = 'L2VlanNetwork'
                            and uuid in (
                                query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                            )
                        )
                    ))
                ) or uuid in (
                    query L2Network.uuid where type = 'L2VlanNetwork'
                    and(
                        physicalInterface not in (
                            query L2Network.physicalInterface where type = 'L2VlanNetwork'
                            and uuid in (
                                query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                            )
                        ) and uuid in (
                            query L2VlanNetwork.uuid
                        )
                    )
                )
            )
        ) or uuid in (
            query L2Network.uuid where type = 'VxlanNetworkPool'
            and uuid not in (
                query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
            )
        ) or uuid in (
            query L2Network.uuid where type = 'HardwareVxlanNetworkPool'
            and uuid not in (
                query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
            )
        )
    ) and uuid not in (
        query L2Network.uuid where cluster.hypervisorType in ('baremetal', 'KVM')
    )
)`;

export const zql1 = `
query L2Network.uuid where (((((type1 in 'L2VlanNetwork'))))) and 
(physicalInterface not in (
    ((
    query L2Network.physicalInterface where ((type = 'L2VlanNetwork')) ) 
))
)
`;
export const zql6 = `
query L2Network.uuid where type1 in (('L2VlanNetwork')) or (type2 in (('L2VlanNetwork')))
`;
// error statements
export const zql3 = `
query L2Network.uuid where(
  (
    uuid in (
          query L2Network.uuid where type = 'L2VlanNetwork'
          and(
              uuid in (query L2Network.uuid where type = 'L2VlanNetwork'
                  and(physicalInterface not in (
                      query L2Network.physicalInterface where type = 'L2VlanNetwork'
                      and uuid in (
                          query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                      )
                  ) and uuid in (
                      query L2VlanNetwork.uuid where type = 'L2VlanNetwork'
                      and vlan not in (
                          query L2VlanNetwork.vlan where type = 'L2VlanNetwork'
                          and uuid in (
                              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                          )
                      )
                  ))
              ) or uuid in (
                  query L2Network.uuid where type = 'L2VlanNetwork'
                  and(
                      physicalInterface not in (
                          query L2Network.physicalInterface where type = 'L2VlanNetwork'
                          and uuid in (
                              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
                          )
                      ) and uuid in (
                          query L2VlanNetwork.uuid
                      )
                  )
              )
          )
      ) or uuid in (
          query L2Network.uuid where type = 'VxlanNetworkPool'
          and uuid not in (
              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
          )
      ) or uuid in (
          query L2Network.uuid where type = 'HardwareVxlanNetworkPool'
          and uuid not in (
              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
          )
      )
  ) and uuid not in (
      query L2Network.uuid where cluster.hypervisorType in ('baremetal', 'KVM')
  )
)`;

export const zql2 = `
query distinct(L2Network.uuid,L2Network.uuid2,) where(
  (
      uuid1 in (
          query L2Network.uuid where 'type.dfdfdf' = 'L2NoVlanNetwork'
      )  or uuid2 in (
          query L2Network.uuid where type = 'HardwareVxlanNetworkPool'
          and uuid21 not in (
              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'
          ) and __systemTag__ has ('ha', 'inhibitHA') and __systemTag__ not has ('4') and __systemTag__ like ('xx','xxxxx')
      )
  ) and uuid3 not in (
      query L2Network.uuid31 where cluster.hypervisorType in ('baremetal', 'KVM')
  )
) 
restrict by (zone.uuid = '28818693f3924d92af2b19b2407317ff')
return with (total)
return with (zwatch{resultName='zwatch1',metricName='CPUUsedUtilization',offsetAheadOfCurrentTime=3600,period=10,labels='CPUNum=10',labels='CPUNum=100', functions=limit(limit=10), functions=top(num=2)}, zwatch{resultName='zwatch2',metricName='CPUUsedUtilization',offsetAheadOfCurrentTime=3600,period=10,labels='CPUNum=10',labels='CPUNum=100', functions=limit(limit=10), functions=top(num=2)})
group by name
group by (name)
order by groupCount asc
order by (groupCount,groupCount1) asc
offset 2
limit 100
named as name
named as (name,name1)
 `;

export const zqll2 = `
 query L2Network where ((uuid in (query L2Network.uuid where type='L2NoVlanNetwork' and physicalInterface not in (query L2Network.physicalInterface where type='L2NoVlanNetwork' and uuid in (query L2NetworkClusterRef.l2NetworkUuid where clusterUuid='0ac65349a7b945c3876794a5fda9b687'))) or uuid in (query L2Network.uuid where type='L2VlanNetwork' and (uuid in (query L2Network.uuid where type='L2VlanNetwork' and (physicalInterface in (query L2Network.physicalInterface where type='L2VlanNetwork' and uuid in (query L2NetworkClusterRef.l2NetworkUuid where clusterUuid='0ac65349a7b945c3876794a5fda9b687')) and uuid in (query L2VlanNetwork.uuid where type='L2VlanNetwork' and vlan not in (query L2VlanNetwork.vlan where type='L2VlanNetwork' and uuid in (query L2NetworkClusterRef.l2NetworkUuid where clusterUuid='0ac65349a7b945c3876794a5fda9b687'))))) or uuid in (query L2Network.uuid where type='L2VlanNetwork' and (physicalInterface not in (query L2Network.physicalInterface where type='L2VlanNetwork' and uuid in (query L2NetworkClusterRef.l2NetworkUuid where clusterUuid='0ac65349a7b945c3876794a5fda9b687')) and uuid in (query L2VlanNetwork.uuid where type='L2VlanNetwork' and vlan not in (query L2VlanNetwork.vlan where type='L2VlanNetwork' and uuid in (query L2NetworkClusterRef.l2NetworkUuid where clusterUuid='0ac65349a7b945c3876794a5fda9b687'))))) or uuid in (query L2Network.uuid where type='L2VlanNetwork' and (physicalInterface not in (query L2Network.physicalInterface where type='L2VlanNetwork' and uuid in (query L2NetworkClusterRef.l2NetworkUuid where clusterUuid='0ac65349a7b945c3876794a5fda9b687')) and uuid in (query L2VlanNetwork.uuid)))))) and uuid not in (query L2Network.uuid where cluster.hypervisorType in ('baremetal','KVM'))) order by createDate desc`;
/**
 * "\n                  )\n              ) or uuid in (query L2Network.uuid where type = 'L2VlanNetwork'\n                  and(physicalInterface not in (\n                      query L2Network.physicalInterface where type = 'L2VlanNetwork'\n                      and uuid in (\n                          query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'\n                      )\n                  ) and uuid in (\n                      query L2VlanNetwork.uuid where type = 'L2VlanNetwork'\n                      and vlan not in (\n                          query L2VlanNetwork.vlan where type = 'L2VlanNetwork'\n                          and uuid in (\n                              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'\n                          )\n                      )\n                  ))\n              ) or uuid in (\n                  query L2Network.uuid where type = 'L2VlanNetwork'\n                  and(\n                      physicalInterface not in (\n                          query L2Network.physicalInterface where type = 'L2VlanNetwork'\n                          and uuid in (\n                              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'\n                          )\n                      ) and uuid in (\n                          query L2VlanNetwork.uuid\n                      )\n                  )\n              )\n          )\n      ) or uuid in (\n          query L2Network.uuid where type = 'VxlanNetworkPool'\n          and uuid not in (\n              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'\n          )\n      ) or uuid in (\n          query L2Network.uuid where type = 'HardwareVxlanNetworkPool'\n          and uuid not in (\n              query L2NetworkClusterRef.l2NetworkUuid where clusterUuid = 'xxxx'\n          )\n      )\n  ) and uuid not in (\n      query L2Network.uuid where cluster.hypervisorType in ('baremetal', 'KVM')\n  )\n)"
 */
/**
 * 
 *   fnName?: ZQLFn  : query distinct(vminstance.name) 
 * restrictBy : restrict by (zone.uuid = '28818693f3924d92af2b19b2407317ff')
 *  returnWith : return with (total)   , 
 *  returnWith : return with (zwatch{metricName='CPUUsedUtilization',offsetAheadOfCurrentTime=3600,period=10,labels='CPUNum=10',labels='CPUNum=100', functions=limit(limit=10), functions=top(num=2)})
 * return with (zwatch{resultName='zwatch1',metricName='CPUUsedUtilization',offsetAheadOfCurrentTime=3600,period=10,labels='CPUNum=10',labels='CPUNum=100', functions=limit(limit=10), functions=top(num=2)}, zwatch{resultName='zwatch2',metricName='CPUUsedUtilization',offsetAheadOfCurrentTime=3600,period=10,labels='CPUNum=10',labels='CPUNum=100', functions=limit(limit=10), functions=top(num=2)})
 * groupBy: group by name,memorySize 
 * orderBy: order by cpuNum asc
 * limit: limit 100
 * offset: offset 10
 * ZQLAction: sum vminstance.cpuNum,memorySize 
 *  has ('ha', 'inhibitHA')
 * not has ('4')
 * 
 * 
 * export interface ZqlObject {
  action?: ZQLAction
  fnName?: ZQLFn
  tableName: string
  fields?: string | string[]
  sumBy?: string
  condition?: PlainObject
  returnWith?: ReturnWithObject
  restrictBy?: PlainObject
  groupBy?: string | string[]
  orderBy?: string
  orderDirection?: 'desc' | 'asc'
  limit?: number
  offset?: number
  namedAs?: string
}
 */
// const ZQL = {
//   stringify: () => {},
// };
// // zql-builder
// const zql = ZQL.stringify({
//   tableName: "L2Network",
//   fields: ["uuid"],
//   condition: {
//     [ZOp.and]: [
//       {
//         [ZOp.or]: [
//           {
//             uuid: {
//               [ZOp.in]: {
//                 [ZOp.query]: {
//                   tableName: "L2Network",
//                   fields: ["uuid"],
//                   condition: {
//                     type: "L2NoVlanNetwork",
//                     physicalInterface: {
//                       [ZOp.notIn]: {
//                         [ZOp.query]: {
//                           tableName: "L2Network",
//                           fields: ["physicalInterface"],
//                           condition: {
//                             type: "L2NoVlanNetwork",
//                             uuid: {
//                               [ZOp.in]: {
//                                 [ZOp.query]: {
//                                   tableName: "L2NetworkClusterRef",
//                                   fields: ["l2NetworkUuid"],
//                                   condition: {
//                                     clusterUuid,
//                                   },
//                                 },
//                               },
//                             },
//                           },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//           {
//             uuid: {
//               [ZOp.in]: {
//                 [ZOp.query]: {
//                   tableName: "L2Network",
//                   fields: ["uuid"],
//                   condition: {
//                     type: "L2VlanNetwork",
//                     [ZOp.or]: [
//                       {
//                         uuid: {
//                           [ZOp.in]: {
//                             [ZOp.query]: {
//                               tableName: "L2Network",
//                               fields: ["uuid"],
//                               condition: {
//                                 type: "L2VlanNetwork",
//                                 [ZOp.and]: {
//                                   physicalInterface: {
//                                     [ZOp.in]: {
//                                       [ZOp.query]: {
//                                         tableName: "L2Network",
//                                         fields: ["physicalInterface"],
//                                         condition: {
//                                           type: "L2VlanNetwork",
//                                           uuid: {
//                                             [ZOp.in]: {
//                                               [ZOp.query]: {
//                                                 tableName:
//                                                   "L2NetworkClusterRef",
//                                                 fields: ["l2NetworkUuid"],
//                                                 condition: {
//                                                   clusterUuid,
//                                                 },
//                                               },
//                                             },
//                                           },
//                                         },
//                                       },
//                                     },
//                                   },
//                                   uuid: {
//                                     [ZOp.in]: {
//                                       [ZOp.query]: {
//                                         tableName: "L2VlanNetwork",
//                                         fields: ["uuid"],
//                                         condition: {
//                                           type: "L2VlanNetwork",
//                                           vlan: {
//                                             [ZOp.notIn]: {
//                                               [ZOp.query]: {
//                                                 tableName: "L2VlanNetwork",
//                                                 fields: ["vlan"],
//                                                 condition: {
//                                                   type: "L2VlanNetwork",
//                                                   uuid: {
//                                                     [ZOp.in]: {
//                                                       [ZOp.query]: {
//                                                         tableName:
//                                                           "L2NetworkClusterRef",
//                                                         fields: [
//                                                           "l2NetworkUuid",
//                                                         ],
//                                                         condition: {
//                                                           clusterUuid,
//                                                         },
//                                                       },
//                                                     },
//                                                   },
//                                                 },
//                                               },
//                                             },
//                                           },
//                                         },
//                                       },
//                                     },
//                                   },
//                                 },
//                               },
//                             },
//                           },
//                         },
//                       },
//                       {
//                         uuid: {
//                           [ZOp.in]: {
//                             [ZOp.query]: {
//                               tableName: "L2Network",
//                               fields: ["uuid"],
//                               condition: {
//                                 type: "L2VlanNetwork",
//                                 [ZOp.and]: {
//                                   physicalInterface: {
//                                     [ZOp.notIn]: {
//                                       [ZOp.query]: {
//                                         tableName: "L2Network",
//                                         fields: ["physicalInterface"],
//                                         condition: {
//                                           type: "L2VlanNetwork",
//                                           uuid: {
//                                             [ZOp.in]: {
//                                               [ZOp.query]: {
//                                                 tableName:
//                                                   "L2NetworkClusterRef",
//                                                 fields: ["l2NetworkUuid"],
//                                                 condition: {
//                                                   clusterUuid,
//                                                 },
//                                               },
//                                             },
//                                           },
//                                         },
//                                       },
//                                     },
//                                   },
//                                   uuid: {
//                                     [ZOp.in]: {
//                                       [ZOp.query]: {
//                                         tableName: "L2VlanNetwork",
//                                         fields: ["uuid"],
//                                         condition: {
//                                           type: "L2VlanNetwork",
//                                           vlan: {
//                                             [ZOp.notIn]: {
//                                               [ZOp.query]: {
//                                                 tableName: "L2VlanNetwork",
//                                                 fields: ["vlan"],
//                                                 condition: {
//                                                   type: "L2VlanNetwork",
//                                                   uuid: {
//                                                     [ZOp.in]: {
//                                                       [ZOp.query]: {
//                                                         tableName:
//                                                           "L2NetworkClusterRef",
//                                                         fields: [
//                                                           "l2NetworkUuid",
//                                                         ],
//                                                         condition: {
//                                                           clusterUuid,
//                                                         },
//                                                       },
//                                                     },
//                                                   },
//                                                 },
//                                               },
//                                             },
//                                           },
//                                         },
//                                       },
//                                     },
//                                   },
//                                 },
//                               },
//                             },
//                           },
//                         },
//                       },
//                       {
//                         uuid: {
//                           [ZOp.in]: {
//                             [ZOp.query]: {
//                               tableName: "L2Network",
//                               fields: ["uuid"],
//                               condition: {
//                                 type: "L2VlanNetwork",
//                                 [ZOp.and]: {
//                                   physicalInterface: {
//                                     [ZOp.notIn]: {
//                                       [ZOp.query]: {
//                                         tableName: "L2Network",
//                                         fields: ["physicalInterface"],
//                                         condition: {
//                                           type: "L2VlanNetwork",
//                                           uuid: {
//                                             [ZOp.in]: {
//                                               [ZOp.query]: {
//                                                 tableName:
//                                                   "L2NetworkClusterRef",
//                                                 fields: ["l2NetworkUuid"],
//                                                 condition: {
//                                                   clusterUuid,
//                                                 },
//                                               },
//                                             },
//                                           },
//                                         },
//                                       },
//                                     },
//                                   },
//                                   uuid: {
//                                     [ZOp.in]: {
//                                       [ZOp.query]: {
//                                         tableName: "L2VlanNetwork",
//                                         fields: ["uuid"],
//                                         type: "L2VlanNetwork",
//                                         vlan: {
//                                           [ZOp.in]: {
//                                             [ZOp.query]: {
//                                               tableName: "L2VlanNetwork",
//                                               fields: ["vlan"],
//                                               condition: {
//                                                 type: "L2VlanNetwork",
//                                                 uuid: {
//                                                   [ZOp.in]: {
//                                                     [ZOp.query]: {
//                                                       tableName:
//                                                         "L2NetworkClusterRef",
//                                                       fields: ["l2NetworkUuid"],
//                                                       condition: {
//                                                         clusterUuid,
//                                                       },
//                                                     },
//                                                   },
//                                                 },
//                                               },
//                                             },
//                                           },
//                                         },
//                                       },
//                                     },
//                                   },
//                                 },
//                               },
//                             },
//                           },
//                         },
//                       },
//                     ],
//                   },
//                 },
//               },
//             },
//           },
//           // VxlanNetworkPool
//           {
//             uuid: {
//               [ZOp.in]: {
//                 [ZOp.query]: {
//                   tableName: "L2Network",
//                   fields: ["uuid"],
//                   condition: {
//                     type: "VxlanNetworkPool",
//                     uuid: {
//                       [ZOp.notIn]: {
//                         [ZOp.query]: {
//                           tableName: "L2NetworkClusterRef",
//                           fields: ["l2NetworkUuid"],
//                           condition: {
//                             clusterUuid,
//                           },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//           // HardwareVxlanNetworkPool
//           {
//             uuid: {
//               [ZOp.in]: {
//                 [ZOp.query]: {
//                   tableName: "L2Network",
//                   fields: ["uuid"],
//                   condition: {
//                     type: "HardwareVxlanNetworkPool",
//                     uuid: {
//                       [ZOp.notIn]: {
//                         [ZOp.query]: {
//                           tableName: "L2NetworkClusterRef",
//                           fields: ["l2NetworkUuid"],
//                           condition: {
//                             clusterUuid,
//                           },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         ],
//       },
//       {
//         uuid: {
//           [ZOp.notIn]: {
//             [ZOp.query]: {
//               tableName: "L2Network",
//               fields: ["uuid"],
//               condition: {
//                 "cluster.hypervisorType": {
//                   [ZOp.in]: ["baremetal", "KVM"],
//                 },
//               },
//             },
//           },
//         },
//       },
//     ],
//   },
// });
/** */
